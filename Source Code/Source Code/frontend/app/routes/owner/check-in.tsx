import { Button, Checkbox, TextInput, Textarea } from "@mantine/core";
import { SearchIcon } from "lucide-react";
import { PageHeading } from "~/components/ui/PageHeading";

export default function OwnerInventory() {
  return (
    <>
      <div className="flex max-w-screen-xl flex-col gap-12 p-10">
        <div className="flex flex-col gap-12">
          <PageHeading title="CHECK IN" />

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Customer Name</th>
                  <th className="px-4 py-2">Product Quantity</th>
                  <th className="px-4 py-2">UPC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">
                    <Checkbox label="Samsung Galaxy S21" />
                  </td>
                  <td className="border px-4 py-2">Ravi Kumar</td>
                  <td className="border px-4 py-2">75</td>
                  <td className="border px-4 py-2">Samsung Galaxy S21</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <Checkbox label="OnePlus 9 Pro" />
                  </td>
                  <td className="border px-4 py-2">Ravi Kumar</td>
                  <td className="border px-4 py-2">60</td>
                  <td className="border px-4 py-2">OnePlus 9 Pro</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <Checkbox label="Xiaomi Mi 11" />
                  </td>
                  <td className="border px-4 py-2">Ravi Kumar</td>
                  <td className="border px-4 py-2">80</td>
                  <td className="border px-4 py-2">Xiaomi Mi 11</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <Checkbox label="Realme 8 Pro" />
                  </td>
                  <td className="border px-4 py-2">Ravi Kumar</td>
                  <td className="border px-4 py-2">70</td>
                  <td className="border px-4 py-2">Realme 8 Pro</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button>Check In</Button>
          </div>

          <div>
            <Textarea label="Memo" placeholder="Enter memo" minRows={6} />
          </div>
        </div>
      </div>
    </>
  );
}
