export default function Header({ title, description }) {
  return (
    <div className="mb-10 flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
      {description && (
        <p className="text-base text-gray-400">{description}</p>
      )}
    </div>
  )
}
