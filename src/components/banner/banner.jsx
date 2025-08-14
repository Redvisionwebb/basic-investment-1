export default function Banner({ title, imageSrc }) {
  return (
    <div
      className="flex bg-center bg-no-repeat bg-cover overflow-hidden text-start justify-start items-center h-64"
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className="text-white text-3xl md:text-5xl font-bold">
          {title}
        </h1>
      </div>
    </div>
  );
}
