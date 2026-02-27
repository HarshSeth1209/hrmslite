export default function Badge({ status }) {
    const cls = status === "Present" ? "badge badge-present" : "badge badge-absent";
    return <span className={cls}>{status}</span>;
}
