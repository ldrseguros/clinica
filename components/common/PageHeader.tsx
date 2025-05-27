
import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem } from '../../types'; // Corrected path

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, actionButton }) => {
  return (
    <div className="mb-6 p-4 bg-clinic-surface shadow-sm rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="text-sm mb-1">
              <ol className="list-none p-0 inline-flex">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {crumb.href ? (
                      <Link to={crumb.href} className="text-clinic-primary hover:underline">{crumb.label}</Link>
                    ) : (
                      <span className="text-clinic-text-secondary">{crumb.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-3xl font-bold text-clinic-text-primary">{title}</h1>
        </div>
        {actionButton && <div className="mt-4 md:mt-0">{actionButton}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
