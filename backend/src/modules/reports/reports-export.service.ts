import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';

@Injectable()
export class ReportsExportService {
  async createXlsx(report: any) {
    const workbook = new Workbook();
    workbook.creator = 'Muhasebe Sistemi';
    workbook.created = new Date();

    const summarySheet = workbook.addWorksheet('Ozet');
    summarySheet.columns = [
      { header: 'Alan', key: 'alan', width: 30 },
      { header: 'Deger', key: 'deger', width: 40 },
    ];
    summarySheet.addRows([
      { alan: 'Musteri', deger: report.customer.fullName },
      { alan: 'Rapor Tipi', deger: report.reportType },
      { alan: 'Baslangic', deger: report.period.from },
      { alan: 'Bitis', deger: report.period.to },
      { alan: 'Toplam Borc (USD)', deger: report.totals.totalDebtUsd },
      { alan: 'Toplam Odeme (USD)', deger: report.totals.totalPaymentUsd },
      { alan: 'Guncel Bakiye (USD)', deger: report.totals.balanceUsd },
    ]);

    const deliveriesSheet = workbook.addWorksheet('Teslimatlar');
    deliveriesSheet.columns = [
      { header: 'Tarih', key: 'tarih', width: 14 },
      { header: 'Teslimat No', key: 'teslimatNo', width: 20 },
      { header: 'Urun', key: 'urun', width: 28 },
      { header: 'Boyut', key: 'boyut', width: 14 },
      { header: 'Miktar', key: 'miktar', width: 12 },
      { header: 'Birim Fiyat (USD)', key: 'birimFiyat', width: 18 },
      { header: 'Toplam (USD)', key: 'toplam', width: 16 },
    ];
    for (const delivery of report.deliveries) {
      for (const item of delivery.items) {
        deliveriesSheet.addRow({
          tarih: delivery.transactionDate.toISOString().slice(0, 10),
          teslimatNo: delivery.id,
          urun: item.productName,
          boyut: item.productSize || '-',
          miktar: Number(item.quantity),
          birimFiyat: Number(item.unitPriceUsd),
          toplam: Number(item.lineTotalUsd),
        });
      }
    }

    const paymentsSheet = workbook.addWorksheet('Odemeler');
    paymentsSheet.columns = [
      { header: 'Tarih', key: 'tarih', width: 14 },
      { header: 'Tutar (USD)', key: 'tutar', width: 16 },
      { header: 'Kur Para Birimi', key: 'kurPb', width: 16 },
      { header: 'Kur', key: 'kur', width: 12 },
      { header: 'Karsilik Tutar', key: 'karsilik', width: 16 },
      { header: 'Yontem', key: 'yontem', width: 14 },
      { header: 'Referans', key: 'referans', width: 20 },
      { header: 'Not', key: 'not', width: 28 },
    ];
    for (const payment of report.payments) {
      paymentsSheet.addRow({
        tarih: payment.paymentDate.toISOString().slice(0, 10),
        tutar: Number(payment.amountUsd),
        kurPb: payment.exchangeCurrency || '-',
        kur: payment.exchangeRate ? Number(payment.exchangeRate) : '',
        karsilik: payment.amountExchange ? Number(payment.amountExchange) : '',
        yontem: payment.paymentMethod,
        referans: payment.referenceNo || '-',
        not: payment.note || '-',
      });
    }

    for (const ws of [summarySheet, deliveriesSheet, paymentsSheet]) {
      ws.getRow(1).font = { bold: true };
    }

    return workbook.xlsx.writeBuffer();
  }
}