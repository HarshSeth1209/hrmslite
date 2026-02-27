import { Check, XCircle } from "lucide-react";

export default function Badge({ status }) {
    const isPresent = status === "Present";
    const cls = isPresent ? "badge badge-present" : "badge badge-absent";
    const Icon = isPresent ? Check : XCircle;
    return (
        <span className={cls}>
            <Icon size={12} strokeWidth={2.5} aria-hidden />
            {status}
        </span>
    );
}
