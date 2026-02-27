export default function EmptyState({ icon, title, description }) {
    const iconContent =
        typeof icon === "string" ? icon : icon ?? "📋";
    return (
        <div className="empty-state">
            <div className="empty-state-icon" aria-hidden>
                {iconContent}
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-desc">{description}</p>}
        </div>
    );
}
