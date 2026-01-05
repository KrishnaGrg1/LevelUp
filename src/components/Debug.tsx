export const Debug = <T,>({ data }: { data: T }) =>
  process.env.NODE_ENV === 'development' ? (
    <pre className="mt-2 hidden overflow-clip rounded-lg p-4 md:block">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  ) : null;
