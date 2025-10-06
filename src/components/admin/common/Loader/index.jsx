import React from 'react'
import './loader.css'
// const Loader = () => {
//   return (
//     <div className="flex h-screen items-center justify-center bg-white dark:bg-dark">
//       <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
//     </div>
//   );
// };

// export default Loader;

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[99999] p-2">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;