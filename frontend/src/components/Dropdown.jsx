import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function Dropdown({
    id,
    options = [],
    value,
    onChange,
    placeholder = "Select…",
    className = "",
    disabled = false,
    name,
}) {
    const [open, setOpen] = useState(false);
    const [focusIdx, setFocusIdx] = useState(-1);
    const wrapRef = useRef(null);
    const listRef = useRef(null);

    const selected = options.find((o) => o.value === value) || null;

    const close = useCallback(() => {
        setOpen(false);
        setFocusIdx(-1);
    }, []);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [close]);

    useEffect(() => {
        if (open && listRef.current && focusIdx >= 0) {
            const el = listRef.current.children[focusIdx];
            if (el) el.scrollIntoView({ block: "nearest" });
        }
    }, [focusIdx, open]);

    const choose = (opt) => {
        if (onChange) {
            const synth = { target: { name: name || "", value: opt.value } };
            onChange(synth);
        }
        close();
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

        if (!open) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
                e.preventDefault();
                setOpen(true);
                const curIdx = options.findIndex((o) => o.value === value);
                setFocusIdx(curIdx >= 0 ? curIdx : 0);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusIdx((i) => (i + 1) % options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusIdx((i) => (i - 1 + options.length) % options.length);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (focusIdx >= 0 && options[focusIdx]) choose(options[focusIdx]);
                break;
            case "Escape":
            case "Tab":
                close();
                break;
            default: {
                const ch = e.key.toLowerCase();
                if (ch.length === 1) {
                    const idx = options.findIndex(
                        (o) => o.label.toLowerCase().startsWith(ch)
                    );
                    if (idx >= 0) setFocusIdx(idx);
                }
            }
        }
    };

    return (
        <div
            ref={wrapRef}
            className={`custom-dropdown ${open ? "custom-dropdown--open" : ""} ${disabled ? "custom-dropdown--disabled" : ""} ${className}`}
        >
            <button
                id={id}
                type="button"
                className="custom-dropdown__trigger"
                onClick={() => !disabled && setOpen((o) => !o)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
            >
                <span className={`custom-dropdown__value ${!selected ? "custom-dropdown__placeholder" : ""}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown size={16} className="custom-dropdown__chevron" aria-hidden />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    className="custom-dropdown__menu"
                    role="listbox"
                    aria-activedescendant={focusIdx >= 0 ? `${id}-opt-${focusIdx}` : undefined}
                >
                    {options.map((opt, i) => (
                        <li
                            key={opt.value}
                            id={`${id}-opt-${i}`}
                            role="option"
                            aria-selected={opt.value === value}
                            className={`custom-dropdown__option ${opt.value === value ? "custom-dropdown__option--selected" : ""} ${i === focusIdx ? "custom-dropdown__option--focused" : ""}`}
                            onMouseEnter={() => setFocusIdx(i)}
                            onClick={() => choose(opt)}
                        >
                            <span className="custom-dropdown__option-label">{opt.label}</span>
                            {opt.value === value && (
                                <Check size={15} className="custom-dropdown__check" aria-hidden />
                            )}
                        </li>
                    ))}
                    {options.length === 0 && (
                        <li className="custom-dropdown__empty">No options</li>
                    )}
                </ul>
            )}
        </div>
    );
}
