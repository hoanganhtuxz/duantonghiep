import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    "@media max-width: 400": {
      flexDirection: "column",
    },
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const InvoicePDF = ({ data }) => {
  const { product, user, price, address, information } = data;
  const products = data.products || [];

  return (
    <Document>
      <Page size="A4" style={styles.container}>
        <View style={styles.section}>
          <Text>Đơn vị:.........................</Text>
          <Text>Bộ phận:.........................</Text>
          <Text>Ngày........tháng.......năm.......</Text>
          <Text>Số: ...........................</Text>
          <Text>Có ...........................</Text>
          <Text>- Họ và tên người nhận hàng: {user}</Text>
          <Text>- Lý do xuất kho: {information}</Text>
          <Text>- Xuất tại kho (ngân lớp): Địa điểm {address}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            STT Tên, nhãn hiệu quy cách, phẩm chất vật tư, dụng cụ sản phẩm,
            hàng hóa Mã số Đơn vị tính Số lượng Đơn giá Thành tiền
          </Text>
          {products.map((product, index) => (
            <View key={product._id} style={styles.container}>
              <Text>{index + 1}</Text>
              <Text>{product.name}</Text>
              <Text>{product.code}</Text>
              <Text>{product.label}</Text>
              <Text>{product.value}</Text>
              <Text>{product.quantity}</Text>
              <Text>{product.price}</Text>
              <Text>{product.quantity * product.price}</Text>
            </View>
          ))}
          <Text>Cộng</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
