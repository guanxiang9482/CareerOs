import { useCallback, useState } from 'react'
import { listAllStorageEntries, STORAGE_PREFIX, type StorageEntry } from '../data/storage'

export function StorageDebugPanel() {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<StorageEntry[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const refresh = useCallback(() => {
    const next = listAllStorageEntries()
    setEntries(next)
    if (selectedKey && !next.some((e) => e.key === selectedKey)) {
      setSelectedKey(null)
    }
  }, [selectedKey])

  function toggleOpen() {
    if (!open) refresh()
    setOpen((prev) => !prev)
  }

  const selected = entries.find((e) => e.key === selectedKey)

  return (
    <>
      <button
        type="button"
        onClick={toggleOpen}
        className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D8CFC0] hover:bg-white/10"
        title="View careeros:* localStorage keys saved in this browser"
      >
        Storage
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close storage viewer"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-[min(80vh,640px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#EBE7E0] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EBE7E0] bg-[#0B1E33] px-4 py-3 text-white">
              <div>
                <p className="text-sm font-bold">Local Storage Viewer</p>
                <p className="text-[10px] font-mono text-[#B5A88F]">
                  Keys prefixed with <span className="text-white">{STORAGE_PREFIX}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={refresh}
                  className="rounded bg-white/10 px-3 py-1 text-[10px] font-mono uppercase hover:bg-white/20"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded bg-white/10 px-3 py-1 text-[10px] font-mono uppercase hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
              <div className="overflow-y-auto border-b border-[#EBE7E0] md:border-b-0 md:border-r">
                <p className="sticky top-0 border-b border-[#EBE7E0] bg-[#FAF8F5] px-3 py-2 text-[10px] font-mono uppercase text-[#9A7B56]">
                  {entries.length} saved key{entries.length === 1 ? '' : 's'}
                </p>
                {entries.length === 0 ? (
                  <p className="p-4 text-xs text-[#6B5A44]">No Career OS data in this browser yet.</p>
                ) : (
                  entries.map((entry) => (
                    <button
                      key={entry.key}
                      type="button"
                      onClick={() => setSelectedKey(entry.key)}
                      className={`block w-full border-b border-[#FAF8F5] px-3 py-2 text-left text-xs font-mono hover:bg-[#FAF8F5] ${
                        selectedKey === entry.key ? 'bg-[#FAF8F5] text-[#0B1E33] font-semibold' : 'text-[#6B5A44]'
                      }`}
                    >
                      {entry.key}
                    </button>
                  ))
                )}
              </div>

              <div className="overflow-y-auto bg-[#FAF8F5] p-4">
                {selected ? (
                  <>
                    <p className="mb-2 text-[10px] font-mono uppercase text-[#9A7B56]">{selected.key}</p>
                    <pre className="overflow-x-auto rounded-lg border border-[#EBE7E0] bg-white p-3 text-[11px] leading-relaxed text-[#0B1E33]">
                      {typeof selected.value === 'string'
                        ? selected.value
                        : JSON.stringify(selected.value, null, 2)}
                    </pre>
                  </>
                ) : (
                  <p className="text-xs text-[#6B5A44]">Select a key to inspect its saved JSON.</p>
                )}
              </div>
            </div>

            <div className="border-t border-[#EBE7E0] bg-white px-4 py-2 text-[10px] text-[#6B5A44]">
              DevTools shortcut: Application → Local Storage → your site URL → look for keys starting with{' '}
              <span className="font-mono text-[#9A7B56]">{STORAGE_PREFIX}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
