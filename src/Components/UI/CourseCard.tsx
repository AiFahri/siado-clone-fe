import { memo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Card from "@/Components/Common/Card";
import { formatNumber } from "@/Utils/formatters";
import type { Course, User } from "@/types";

interface CourseCardProps {
  course: Course;
  showActions?: boolean;
  actions?: ReactNode;
  linkTo?: string;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

interface CourseStatsProps {
  credits: number;
  studentsCount: number;
  variant?: "default" | "compact";
}

interface CourseLecturersProps {
  lecturers: User[];
  maxDisplay?: number;
  variant?: "default" | "compact";
}

const CourseStats = memo(
  ({ credits, studentsCount, variant = "default" }: CourseStatsProps) => {
    const textSize = variant === "compact" ? "text-xs" : "text-sm";

    return (
      <div
        className={`flex items-center justify-between ${textSize} text-gray-500 mb-4`}
      >
        <span>{formatNumber(credits)} SKS</span>
        <span>{formatNumber(studentsCount)} mahasiswa</span>
      </div>
    );
  }
);

CourseStats.displayName = "CourseStats";

const CourseLecturers = memo(
  ({
    lecturers,
    maxDisplay = 2,
    variant = "default",
  }: CourseLecturersProps) => {
    const textSize = variant === "compact" ? "text-xs" : "text-sm";
    const displayLecturers = lecturers.slice(0, maxDisplay);
    const remainingCount = lecturers.length - maxDisplay;

    if (lecturers.length === 0) {
      return (
        <p className={`${textSize} text-gray-400 italic`}>Belum ada dosen</p>
      );
    }

    return (
      <div className={`${textSize} text-gray-600`}>
        <span className="font-medium">Dosen: </span>
        {displayLecturers.map((lecturer, index) => (
          <span key={lecturer.id}>
            {lecturer.name}
            {index < displayLecturers.length - 1 && ", "}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-gray-400">
            {displayLecturers.length > 0 && ", "}+{remainingCount} lainnya
          </span>
        )}
      </div>
    );
  }
);

CourseLecturers.displayName = "CourseLecturers";

const CourseCard = memo(
  ({
    course,
    showActions = false,
    actions,
    linkTo,
    className = "",
    variant = "default",
  }: CourseCardProps) => {
    const isCompact = variant === "compact";
    const isDetailed = variant === "detailed";

    const cardContent = (
      <Card
        className={`hover:shadow-lg transition-shadow duration-200 ${className}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-gray-900 truncate ${
                isCompact ? "text-base" : "text-lg"
              }`}
            >
              {course.name}
            </h3>
            <p className={`text-gray-600 ${isCompact ? "text-xs" : "text-sm"}`}>
              {course.code}
            </p>
          </div>

          {showActions && actions && (
            <div className="ml-4 flex-shrink-0">{actions}</div>
          )}
        </div>

        <CourseStats
          credits={course.credits || 3}
          studentsCount={course.students_count || 0}
          variant={isCompact ? "compact" : "default"}
        />

        {isDetailed && course.lecturers && (
          <div className="mb-4">
            <CourseLecturers
              lecturers={course.lecturers}
              maxDisplay={isCompact ? 1 : 2}
              variant={isCompact ? "compact" : "default"}
            />
          </div>
        )}

        {isDetailed && course.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          </div>
        )}

        <div
          className={`flex items-center justify-between ${
            isCompact ? "text-xs" : "text-sm"
          } text-gray-400 border-t pt-3`}
        >
          <span>
            Dibuat: {new Date(course.created_at).toLocaleDateString("id-ID")}
          </span>
          {course.updated_at !== course.created_at && (
            <span>
              Diupdate:{" "}
              {new Date(course.updated_at).toLocaleDateString("id-ID")}
            </span>
          )}
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

CourseCard.displayName = "CourseCard";

export const CompactCourseCard = memo(
  (props: Omit<CourseCardProps, "variant">) => (
    <CourseCard {...props} variant="compact" />
  )
);

CompactCourseCard.displayName = "CompactCourseCard";

export const DetailedCourseCard = memo(
  (props: Omit<CourseCardProps, "variant">) => (
    <CourseCard {...props} variant="detailed" />
  )
);

DetailedCourseCard.displayName = "DetailedCourseCard";

interface CourseGridProps {
  courses: Course[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderCard?: (course: Course) => ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const CourseGrid = memo(
  ({
    courses,
    isLoading = false,
    emptyMessage = "Tidak ada course",
    renderCard,
    className = "",
    columns = 3,
  }: CourseGridProps) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    if (isLoading) {
      return (
        <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
        {courses.map((course) => (
          <div key={course.id}>
            {renderCard ? renderCard(course) : <CourseCard course={course} />}
          </div>
        ))}
      </div>
    );
  }
);

CourseGrid.displayName = "CourseGrid";

export default CourseCard;
