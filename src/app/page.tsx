'use client'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

type Rounding = 'ceil' | 'round' | 'floor'

export default function Home() {
  const { t, lang } = useI18n()
  const [total, setTotal] = useState('')
  const [people, setPeople] = useState(4)
  const [rounding, setRounding] = useState<Rounding>('ceil')
  const [hostExtra, setHostExtra] = useState(false)
  const [hostAdd, setHostAdd] = useState('500')
  const [copied, setCopied] = useState(false)

  const totalNum = Number(String(total).replace(/[^\d.]/g, '')) || 0
  const isValid = totalNum > 0 && people >= 2

  let perPerson = 0
  let hostTotal = 0
  let hostAddNum = 0
  if (isValid) {
    const base = totalNum / people
    const fns = { ceil: Math.ceil, round: Math.round, floor: Math.floor }
    perPerson = fns[rounding](base)
    hostAddNum = hostExtra ? Math.max(0, Number(hostAdd) || 0) : 0
    hostTotal = perPerson + hostAddNum
  }

  const copyText = () => {
    if (!isValid) return
    const text = lang === 'ja'
      ? `割り勘計算結果\n合計：¥${totalNum.toLocaleString()}\n人数：${people}人\n1人あたり：¥${perPerson.toLocaleString()}${hostExtra && hostAddNum > 0 ? `\n（幹事：¥${hostTotal.toLocaleString()}）` : ''}`
      : `Split Bill Result\nTotal: ¥${totalNum.toLocaleString()}\nPeople: ${people}\nPer person: ¥${perPerson.toLocaleString()}${hostExtra && hostAddNum > 0 ? `\n(Host: ¥${hostTotal.toLocaleString()})` : ''}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const roundingOpts: [Rounding, string][] = [
    ['ceil', lang === 'ja' ? '切り上げ' : 'Round up'],
    ['round', lang === 'ja' ? '四捨五入' : 'Round'],
    ['floor', lang === 'ja' ? '切り捨て' : 'Round down'],
  ]

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{t.appName}</h1>
        <p className="text-base text-gray-500">{t.tagline}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {lang === 'ja' ? '合計金額（円）' : 'Total Amount (¥)'}
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={total}
            onChange={e => setTotal(e.target.value)}
            placeholder={lang === 'ja' ? '例：12800' : 'e.g. 12800'}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {lang === 'ja' ? '人数' : 'Number of People'}
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPeople(p => Math.max(2, p - 1))}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold text-gray-700 transition-colors"
              aria-label="decrease"
            >−</button>
            <span className="text-3xl font-bold text-gray-800 w-16 text-center tabular-nums">{people}</span>
            <button
              onClick={() => setPeople(p => Math.min(50, p + 1))}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold text-gray-700 transition-colors"
              aria-label="increase"
            >+</button>
            <span className="text-sm text-gray-500">{lang === 'ja' ? '人' : 'people'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {lang === 'ja' ? '端数処理' : 'Rounding'}
          </label>
          <div className="flex gap-2">
            {roundingOpts.map(([v, label]) => (
              <button
                key={v}
                onClick={() => setRounding(v)}
                className={`flex-1 min-h-[44px] rounded-lg text-sm font-medium border transition-colors ${rounding === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hostExtra}
            onChange={e => setHostExtra(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            {lang === 'ja' ? '幹事の余裕分を上乗せする' : 'Add host buffer'}
          </span>
        </label>
        {hostExtra && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              {lang === 'ja' ? '幹事への上乗せ額（円）' : 'Host extra (¥)'}
            </label>
            <input
              type="number"
              value={hostAdd}
              onChange={e => setHostAdd(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {isValid ? (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-blue-600 font-medium mb-1">
              {lang === 'ja' ? '1人あたり' : 'Per Person'}
            </div>
            <div className="text-5xl font-bold text-blue-700 tabular-nums">
              ¥{perPerson.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {lang === 'ja' ? `${people}人 × ¥${perPerson.toLocaleString()} = ¥${(perPerson * people).toLocaleString()}（差分：¥${(perPerson * people - totalNum).toLocaleString()}）` : `${people} × ¥${perPerson.toLocaleString()} = ¥${(perPerson * people).toLocaleString()}`}
            </div>
          </div>
          {hostExtra && hostAddNum > 0 && (
            <div className="text-center border-t border-blue-200 pt-3 mt-3">
              <div className="text-xs text-gray-500 mb-0.5">{lang === 'ja' ? '幹事の取り分' : 'Host pays'}</div>
              <div className="text-2xl font-bold text-gray-800 tabular-nums">¥{hostTotal.toLocaleString()}</div>
            </div>
          )}
          <button
            onClick={copyText}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium min-h-[44px] rounded-lg transition-colors text-sm"
          >
            {copied ? (lang === 'ja' ? 'コピーしました！' : 'Copied!') : (lang === 'ja' ? '結果をコピー' : 'Copy Result')}
          </button>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400">
          {lang === 'ja' ? '合計金額を入力すると計算します' : 'Enter total amount to calculate'}
        </p>
      )}
    </main>
  )
}
