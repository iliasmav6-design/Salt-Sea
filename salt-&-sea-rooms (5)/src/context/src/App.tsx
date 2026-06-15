<div className="flex items-center space-x-2.5">
  {!isEditingMode && (
    <button
      onClick={() => {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('edit', 'true');
          window.location.href = url.pathname + url.search;
        }
      }}
      className="p-1.5 text-slate-500 hover:text-brand hover:bg-white/10 rounded-lg transition-all cursor-pointer opacity-40 hover:opacity-100"
      title="Διαχειριστής / Admin Login"
    >
      <Lock className="h-3 w-3" />
    </button>
  )}
  <p className="flex items-center gap-1">
    <span>Made with</span>
    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
    <span>for Greek Hospitality</span>
  </p>
</div>
