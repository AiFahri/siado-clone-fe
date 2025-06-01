import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Card from "@/Components/Common/Card";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  bgColor: string;
  link: string;
  isLoading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  link,
  isLoading = false,
}: StatCardProps) => {
  return (
    <Link to={link}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-lg p-3`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {(value || 0).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default StatCard;
