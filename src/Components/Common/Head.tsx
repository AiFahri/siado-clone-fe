import React, { useEffect } from 'react';

interface HeadProps {
  title: string;
}

const Head: React.FC<HeadProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default Head;
