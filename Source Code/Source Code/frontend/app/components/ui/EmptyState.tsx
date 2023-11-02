import React from "react";

// Define a custom XIcon component
function XIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      width={props.size}
      height={props.size}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

type EmptyStateProps = {
  label: string;
  icon?: React.ReactNode;
};

export function EmptyState(props: EmptyStateProps) {
  const { label, icon } = props;

  return (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <div className="flex items-center justify-center">
        {icon || <XIcon size={70} className="text-gray-600" />}
      </div>
      <span className="mt-4 block text-sm font-semibold text-gray-500">
        {label}
      </span>
    </div>
  );
}
