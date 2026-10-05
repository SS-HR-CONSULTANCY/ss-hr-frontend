import React from "react";
import { Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { ImportedCustomer } from "@/utils/apis/adminPlatformLeadsApi";

export const AdminPlatformLeadsTableColumns = (
  onView: (customer: ImportedCustomer) => void,
  onUpdateStatus: (id: string, newStatus: string, comment: string, scheduledDate?: string, state?: string) => void
): ColumnDef<ImportedCustomer>[] => [
  {
    id: "serialNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sr. No." />
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div className="font-medium text-gray-500">{pageIndex * pageSize + row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const linkedinUrl = row.original.linkedinUrl;

      return (
        <div className="font-medium flex items-center justify-start gap-2 text-left w-full">
          {name}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-blue-700 transition-colors shrink-0"
              title="View LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="text-left w-full flex justify-start">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      if (!phone) return <div>N/A</div>;
      
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}`;
      return (
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-green-600 hover:text-green-700 hover:underline flex items-center justify-center gap-1"
        >
          {phone}
        </a>
      );
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => {
      const initialState = row.getValue("state") as string || "";
      const status = row.getValue("status") as string || "Pending";
      const comment = row.getValue("comment") as string || "";
      const customerId = row.original._id;
      const initialDate = row.original.scheduledDate;
      const formattedInitialDate = initialDate ? new Date(initialDate).toISOString().split('T')[0] : "";
      const [localState, setLocalState] = React.useState(initialState);

      React.useEffect(() => {
        setLocalState(initialState);
      }, [initialState]);

      return (
        <input 
          value={localState}
          onChange={(e) => setLocalState(e.target.value)}
          onBlur={() => {
            if (localState !== initialState) {
              onUpdateStatus(customerId, status, comment, formattedInitialDate, localState);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (localState !== initialState) {
                onUpdateStatus(customerId, status, comment, formattedInitialDate, localState);
              }
            }
          }}
          className="w-full min-w-[100px] px-2 py-1.5 text-sm border border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-transparent rounded-md transition-all placeholder:text-gray-400"
          placeholder="N/A"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string || "Pending";
      const comment = row.getValue("comment") as string || "";
      const customerId = row.original._id;
      const initialDate = row.original.scheduledDate;
      const formattedInitialDate = initialDate ? new Date(initialDate).toISOString().split('T')[0] : "";

      return (
        <select
          value={status}
          onChange={(e) => onUpdateStatus(customerId, e.target.value, comment, formattedInitialDate)}
          className={`px-2 py-1 text-xs font-semibold rounded-full border border-transparent hover:border-gray-300 focus:ring-0 focus:outline-none cursor-pointer outline-none appearance-none
            ${status === 'Pending' ? 'bg-blue-100 text-blue-700' : 
              status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : 
              status === 'Interested' ? 'bg-purple-100 text-purple-700' :
              status === 'Converted' ? 'bg-green-100 text-green-700' :
              status === 'Not Interested' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'}`}
        >
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Converted">Converted</option>
          <option value="Not Interested">Not Interested</option>
        </select>
      );
    },
  },
  {
    accessorKey: "comment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => {
      const initialComment = row.getValue("comment") as string || "";
      const status = row.getValue("status") as string || "Pending";
      const customerId = row.original._id;
      const initialDate = row.original.scheduledDate;
      const formattedInitialDate = initialDate ? new Date(initialDate).toISOString().split('T')[0] : "";
      const [localComment, setLocalComment] = React.useState(initialComment);

      React.useEffect(() => {
        setLocalComment(initialComment);
      }, [initialComment]);

      return (
        <input 
          value={localComment}
          onChange={(e) => setLocalComment(e.target.value)}
          onBlur={() => {
            if (localComment !== initialComment) {
              onUpdateStatus(customerId, status, localComment, formattedInitialDate);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (localComment !== initialComment) {
                onUpdateStatus(customerId, status, localComment, formattedInitialDate);
              }
            }
          }}
          className="w-full min-w-[150px] px-2 py-1.5 text-sm border border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-transparent rounded-md transition-all"
          placeholder="Add comment..."
        />
      );
    },
  },
  {
    accessorKey: "scheduledDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scheduled Date" />
    ),
    cell: ({ row }) => {
      const initialDate = row.original.scheduledDate;
      const status = row.getValue("status") as string || "Pending";
      const comment = row.getValue("comment") as string || "";
      const customerId = row.original._id;
      
      const formattedInitial = initialDate ? new Date(initialDate).toISOString().split('T')[0] : "";
      const [localDate, setLocalDate] = React.useState(formattedInitial);

      React.useEffect(() => {
        setLocalDate(formattedInitial);
      }, [formattedInitial]);

      return (
        <input 
          type="date"
          value={localDate}
          onChange={(e) => {
            setLocalDate(e.target.value);
            onUpdateStatus(customerId, status, comment, e.target.value);
          }}
          className="w-full min-w-[130px] px-2 py-1.5 text-sm border border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-transparent rounded-md transition-all text-gray-700"
        />
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <button
          onClick={() => onView(row.original)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto transition-colors"
        >
          <Eye className="h-4 w-4" /> View
        </button>
      );
    },
  },
];
