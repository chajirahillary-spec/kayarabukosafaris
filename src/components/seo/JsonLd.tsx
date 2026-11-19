export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Safe: data is built server-side from our own typed objects; "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
