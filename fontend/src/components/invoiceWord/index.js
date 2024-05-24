import React from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

const InvoiceWord = ({ data }) => {
  const { product, user, price, address, information } = data;
  const products = data.products || [];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(`Đơn vị:.........................`),
              new TextRun(`Bộ phận:.........................`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Ngày........tháng.......năm......`),
              new TextRun(`Số: ..........................`),
              new TextRun(`Có ..........................`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`- Họ và tên người nhận hàng: ${user}`),
              new TextRun(`- Lý do xuất kho: ${information}`),
              new TextRun(`- Xuất tại kho (ngân lớp): Địa điểm ${address}`),
            ],
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("STT")],
                    width: { size: 30, type: WidthType.AUTO },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        "Tên, nhãn hiệu quy cách, phẩm chất vật tư, dụng cụ sản phẩm, hàng hóa"
                      ),
                    ],
                    width: { size: 200, type: WidthType.AUTO },
                  }),
                  new TableCell({
                    children: [new Paragraph("Mã số")],
                    width: { size: 50, type: WidthType.AUTO },
                  }),
                  new TableCell({
                    children: [new Paragraph("Đơn vị tính")],
                    width: { size: 100, type: WidthType.AUTO },
                  }),
                  new TableCell({
                    children: [new Paragraph("Số lượng")],
                    width: { size: 80, type: WidthType.AUTO },
                  }),
                  new TableCell({
                    children: [new Paragraph("Đơn giá")],
                    width: { size: 80, type: WidthType.AUTO },
                  }),
                  new TableCell({
                    children: [new Paragraph("Thành tiền")],
                    width: { size: 80, type: WidthType.AUTO },
                  }),
                ],
              }),
              ...products.map(
                (product, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(`${index + 1}`)],
                        width: { size: 30, type: WidthType.AUTO },
                      }),
                      new TableCell({
                        children: [new Paragraph(product.name)],
                        width: { size: 200, type: WidthType.AUTO },
                      }),
                      new TableCell({
                        children: [new Paragraph(product.code)],
                        width: { size: 50, type: WidthType.AUTO },
                      }),
                      new TableCell({
                        children: [new Paragraph(product.label)],
                        width: { size: 100, type: WidthType.AUTO },
                      }),
                      new TableCell({
                        children: [new Paragraph(`${product.quantity}`)],
                        width: { size: 80, type: WidthType.AUTO },
                      }),
                      new TableCell({
                        children: [new Paragraph(`${product.price}`)],
                        width: { size: 80, type: WidthType.AUTO },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(`${product.quantity * product.price}`),
                        ],
                        width: { size: 80, type: WidthType.AUTO },
                      }),
                    ],
                  })
              ),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Cộng")],
                    colSpan: 6,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph(
                        `${products.reduce(
                          (total, product) =>
                            total + product.quantity * product.price,
                          0
                        )}`
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hang-xuat-kho.docx";
    link.click();
  });

  return null;
};

export default InvoiceWord;
