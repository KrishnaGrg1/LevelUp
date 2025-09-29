export const Debug = <T,>({ data }: { data: T }) =>
  process.env.NODE_ENV === 'development' ? (
    <pre className="p-4 mt-2 hidden md:block rounded-lg overflow-clip">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  ) : null;
