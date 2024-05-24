"use client";

import { IoIosAdd } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import { queryProductState } from "@/atom";
import { Select, Input, Button } from "antd";
import AddProductModal from "../../../components/products/addProduct";
import ProductsTable from "../../../components/products/listProduct";
import { useRouter } from "next/navigation";
export const dynamic = 'force-dynamic';

export default function Page() {
  const setQueryState = useSetRecoilState(queryProductState);
  const router = useRouter();
  const handleChangeSort = (key) => {
    setQueryState((prev) => ({ ...prev, sort: key }));
  };
  const onSearch = (value) => {
    setQueryState((prev) => ({ ...prev, keyword: value }));
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <div className="flex gap-3">
          <Select
            defaultValue="desc"
            style={{ width: 100 }}
            onChange={handleChangeSort}
            options={[
              { value: "desc", label: "Mới nhất" },
              { value: "asc", label: "Cũ nhất" },
            ]}
          />
          <Input.Search
            onSearch={onSearch}
            allowClear
            className="w-[300px]"
            placeholder="Tìm kiếm"
          />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("./export-import")}
            className="flex items-center"
          >
            <IoIosAdd size={20} />
            Nhập kho
          </Button>
          <AddProductModal />
          {/* <Select
            defaultValue="Xuất file"
            style={{ width: 100 }}
            onChange={handleChangeSort}
            options={[
              { value: "export-excel", label: "File Xxcel" },
              { value: "export-docs", label: "File Docs" },
            ]}
          /> */}
        </div>
      </div>
      <ProductsTable />
    </div>
  );
}
