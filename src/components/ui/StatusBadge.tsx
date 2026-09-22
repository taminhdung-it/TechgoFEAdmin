const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipping:  'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive:  'bg-slate-100 text-slate-500 border-slate-200',
  paid:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  refunded:  'bg-orange-50 text-orange-700 border-orange-200',
  normal:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  low:       'bg-amber-50 text-amber-700 border-amber-200',
  critical:  'bg-red-50 text-red-700 border-red-200',
  out:       'bg-slate-100 text-slate-500 border-slate-200',
};

const LABELS: Record<string, string> = {
  pending:   'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping:  'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
  active:    'Hoạt động',
  inactive:  'Ngừng',
  paid:      'Đã thanh toán',
  refunded:  'Hoàn tiền',
  normal:    'Bình thường',
  low:       'Sắp hết',
  critical:  'Nguy hiểm',
  out:       'Hết hàng',
};

export function StatusBadge({ status }: { status: string }) {
  const cls =
    STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-500 border-slate-200';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold ${cls}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
