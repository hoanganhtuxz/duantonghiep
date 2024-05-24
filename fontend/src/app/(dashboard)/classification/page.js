"use client";

import { Input, Select } from "antd";
import { useSetRecoilState } from "recoil";
import { queryStatusState } from "@/atom";
import AddStatusModal from "../../../components/classification/addStatus";
import StatusTable from "../../../components/classification/listClassification";
export const dynamic = 'force-dynamic';

export default function Page() {
  const setQueryState = useSetRecoilState(queryStatusState);

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
          <AddStatusModal />
        </div>
      </div>
      <StatusTable />
    </div>
  );
}
