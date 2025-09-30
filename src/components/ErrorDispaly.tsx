import React from 'react';
import { t } from '@/translations/index';

interface Props {
  errors: string[];
}

const ErrorMessages: React.FC<Props> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="flex flex-col justify-center items-center mt-2 gap-y-2 text-sm text-red-500">
      {errors.map((error, index) => (
        <span key={index}>{t(error)}</span>
      ))}
    </div>
  );
};

export default ErrorMessages;
