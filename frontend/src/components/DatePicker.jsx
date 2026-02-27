import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n) { return String(n).padStart(2, "0"); }

function toYMD(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseYMD(s) {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildCalendar(year, month) {
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = startDay - 1; i >= 0; i--) {
        cells.push({ day: prevDays - i, current: false, date: new Date(year, month - 1, prevDays - i) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, current: true, date: new Date(year, month, d) });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, current: false, date: new Date(year, month + 1, d) });
    }
    return cells;
}

export default function DatePicker({
    id,
    value = "",
    onChange,
    max,
    min,
    placeholder = "Pick a date",
    className = "",
    disabled = false,
    autoFocus = false,
}) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const triggerRef = useRef(null);

    const selected = useMemo(() => parseYMD(value), [value]);
    const maxDate = useMemo(() => parseYMD(max), [max]);
    const minDate = useMemo(() => parseYMD(min), [min]);

    const initial = selected || new Date();
    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    useEffect(() => {
        if (selected) {
            setViewYear(selected.getFullYear());
            setViewMonth(selected.getMonth());
        }
    }, [value]);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [close]);

    useEffect(() => {
        if (autoFocus && triggerRef.current) triggerRef.current.focus();
    }, [autoFocus]);

    const cells = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    const isDisabled = (date) => {
        if (maxDate && date > maxDate) return true;
        if (minDate && date < minDate) return true;
        return false;
    };

    const pick = (cell) => {
        if (!cell.current || isDisabled(cell.date)) return;
        if (onChange) {
            onChange({ target: { value: toYMD(cell.date) } });
        }
        close();
    };

    const today = new Date();
    const displayValue = selected
        ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "";

    return (
        <div
            ref={wrapRef}
            className={`custom-datepicker ${open ? "custom-datepicker--open" : ""} ${disabled ? "custom-datepicker--disabled" : ""} ${className}`}
        >
            <button
                ref={triggerRef}
                id={id}
                type="button"
                className="custom-datepicker__trigger"
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
            >
                <Calendar size={16} className="custom-datepicker__icon" aria-hidden />
                <span className={`custom-datepicker__value ${!selected ? "custom-datepicker__placeholder" : ""}`}>
                    {displayValue || placeholder}
                </span>
            </button>

            {open && (
                <div className="custom-datepicker__panel" role="dialog" aria-label="Choose date">
                    <div className="custom-datepicker__header">
                        <button type="button" className="custom-datepicker__nav" onClick={prevMonth} aria-label="Previous month">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="custom-datepicker__month-year">
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button type="button" className="custom-datepicker__nav" onClick={nextMonth} aria-label="Next month">
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="custom-datepicker__weekdays">
                        {DAYS.map((d) => <span key={d} className="custom-datepicker__weekday">{d}</span>)}
                    </div>

                    <div className="custom-datepicker__grid">
                        {cells.map((cell, i) => {
                            const sel = selected && isSameDay(cell.date, selected);
                            const isToday = cell.current && isSameDay(cell.date, today);
                            const dis = !cell.current || isDisabled(cell.date);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className={
                                        "custom-datepicker__day" +
                                        (sel ? " custom-datepicker__day--selected" : "") +
                                        (isToday && !sel ? " custom-datepicker__day--today" : "") +
                                        (!cell.current ? " custom-datepicker__day--outside" : "") +
                                        (dis ? " custom-datepicker__day--disabled" : "")
                                    }
                                    onClick={() => pick(cell)}
                                    disabled={dis}
                                    tabIndex={-1}
                                    aria-label={cell.date.toDateString()}
                                    aria-pressed={sel}
                                >
                                    {cell.day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="custom-datepicker__footer">
                        <button
                            type="button"
                            className="custom-datepicker__today-btn"
                            onClick={() => {
                                if (!isDisabled(today)) {
                                    if (onChange) onChange({ target: { value: toYMD(today) } });
                                    close();
                                }
                            }}
                            disabled={isDisabled(today)}
                        >
                            Today
                        </button>
                        {selected && (
                            <button
                                type="button"
                                className="custom-datepicker__clear-btn"
                                onClick={() => {
                                    if (onChange) onChange({ target: { value: "" } });
                                    close();
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
