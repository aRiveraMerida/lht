// Section head as in the Tortuga specimen: title + note, sticky on the
// left column of a .section.

export function SectionHeader({
  idx,
  tag,
  id,
}: {
  idx: React.ReactNode
  tag?: React.ReactNode
  id?: string
}) {
  return (
    <div className="section-head">
      <h2 id={id}>{idx}</h2>
      {tag ? <p>{tag}</p> : null}
    </div>
  )
}
