import { memo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Card from "@/Components/Common/Card";
import { formatRole, getRoleColor, formatDate } from "@/Utils/formatters";
import { UserIcon } from "@/Components/UI/Icons";
import type { User } from "@/types";

interface UserCardProps {
  user: User;
  showActions?: boolean;
  actions?: ReactNode;
  linkTo?: string;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  showEmail?: boolean;
  showRole?: boolean;
  showDates?: boolean;
}

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface UserRoleBadgeProps {
  role: string;
  className?: string;
}

const UserAvatar = memo(
  ({ user, size = "md", className = "" }: UserAvatarProps) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    // Get initials from name
    const getInitials = (name: string): string => {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}
      >
        {user.name ? (
          <span
            className={`font-medium text-gray-600 ${
              size === "sm"
                ? "text-xs"
                : size === "lg"
                ? "text-base"
                : "text-sm"
            }`}
          >
            {getInitials(user.name)}
          </span>
        ) : (
          <UserIcon className={`${iconSizes[size]} text-gray-400`} />
        )}
      </div>
    );
  }
);

UserAvatar.displayName = "UserAvatar";

const UserRoleBadge = memo(({ role, className = "" }: UserRoleBadgeProps) => {
  const colorClasses = getRoleColor(role);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      {formatRole(role)}
    </span>
  );
});

UserRoleBadge.displayName = "UserRoleBadge";

const UserCard = memo(
  ({
    user,
    showActions = false,
    actions,
    linkTo,
    className = "",
    variant = "default",
    showEmail = true,
    showRole = true,
    showDates = false,
  }: UserCardProps) => {
    const isCompact = variant === "compact";
    const isDetailed = variant === "detailed";

    const cardContent = (
      <Card
        className={`hover:shadow-lg transition-shadow duration-200 ${className}`}
      >
        <div className="flex items-start space-x-4">
          <UserAvatar
            user={user}
            size={isCompact ? "sm" : isDetailed ? "lg" : "md"}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-gray-900 truncate ${
                    isCompact ? "text-sm" : "text-base"
                  }`}
                >
                  {user.name}
                </h3>

                {showEmail && (
                  <p
                    className={`text-gray-600 truncate ${
                      isCompact ? "text-xs" : "text-sm"
                    }`}
                  >
                    {user.email}
                  </p>
                )}
              </div>

              {showActions && actions && (
                <div className="ml-4 flex-shrink-0">{actions}</div>
              )}
            </div>

            {showRole && (
              <div className="mt-2">
                <UserRoleBadge role={user.role} />
              </div>
            )}

            {isDetailed && (
              <div className="mt-3 space-y-2">
                {user.email_verified_at && (
                  <div className="flex items-center text-sm text-green-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Email Terverifikasi
                  </div>
                )}

                {!user.email_verified_at && (
                  <div className="flex items-center text-sm text-yellow-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Email Belum Terverifikasi
                  </div>
                )}
              </div>
            )}

            {showDates && (user.created_at || user.updated_at) && (
              <div
                className={`mt-3 ${
                  isCompact ? "text-xs" : "text-sm"
                } text-gray-400 space-y-1`}
              >
                {user.created_at && (
                  <div>Bergabung: {formatDate(user.created_at)}</div>
                )}
                {user.updated_at && user.updated_at !== user.created_at && (
                  <div>Diupdate: {formatDate(user.updated_at)}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );

    if (linkTo) {
      return (
        <Link to={linkTo} className="block">
          {cardContent}
        </Link>
      );
    }

    return cardContent;
  }
);

UserCard.displayName = "UserCard";

export const CompactUserCard = memo((props: Omit<UserCardProps, "variant">) => (
  <UserCard {...props} variant="compact" />
));

CompactUserCard.displayName = "CompactUserCard";

export const DetailedUserCard = memo(
  (props: Omit<UserCardProps, "variant">) => (
    <UserCard {...props} variant="detailed" showDates />
  )
);

DetailedUserCard.displayName = "DetailedUserCard";

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderCard?: (user: User) => ReactNode;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export const UserList = memo(
  ({
    users,
    isLoading = false,
    emptyMessage = "Tidak ada user",
    renderCard,
    className = "",
    variant = "default",
  }: UserListProps) => {
    if (isLoading) {
      return (
        <div className={`space-y-4 ${className}`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-12">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={`space-y-4 ${className}`}>
        {users.map((user) => (
          <div key={user.id}>
            {renderCard ? (
              renderCard(user)
            ) : (
              <UserCard user={user} variant={variant} />
            )}
          </div>
        ))}
      </div>
    );
  }
);

UserList.displayName = "UserList";

export { UserAvatar, UserRoleBadge };
export default UserCard;
