import { useMemo, useState } from 'react';
import { calculate, formatNumber, formatWon } from './calc';

type FieldKey = 'distanceKm' | 'vehicles' | 'ratePerKm' | 'baseRatePerKm';

interface FieldDef {
  key: FieldKey;
  label: string;
  unit: string;
  hint: string;
  step: number;
}

const FIELDS: FieldDef[] = [
  { key: 'distanceKm', label: '운행거리', unit: 'km', hint: '차량 1대당 운행거리', step: 1 },
  { key: 'vehicles', label: '차량 수', unit: '대', hint: '투입 차량 대수', step: 1 },
  { key: 'ratePerKm', label: 'km당 운임', unit: '원', hint: '이번에 적용할 운임', step: 10 },
  { key: 'baseRatePerKm', label: '기준 km당 운임', unit: '원', hint: '비교 대상(기존 계약) 운임', step: 10 },
];

const DEFAULTS: Record<FieldKey, string> = {
  distanceKm: '350',
  vehicles: '5',
  ratePerKm: '2200',
  baseRatePerKm: '2500',
};

export default function App() {
  const [values, setValues] = useState<Record<FieldKey, string>>(DEFAULTS);

  const num = (key: FieldKey) => Number(values[key]) || 0;

  const result = useMemo(
    () =>
      calculate({
        distanceKm: Number(values.distanceKm),
        vehicles: Number(values.vehicles),
        ratePerKm: Number(values.ratePerKm),
        baseRatePerKm: Number(values.baseRatePerKm),
      }),
    [values],
  );

  const update = (key: FieldKey, v: string) => setValues((prev) => ({ ...prev, [key]: v }));
  const isSaving = result.savings >= 0;
  const tone = isSaving ? 'good' : 'bad';
  const barMax = Math.max(result.baseCost, result.totalCost, 1);

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <span className="logo" aria-hidden="true">🚚</span>
          <div>
            <h1>물류 운송비 계산기</h1>
            <p>운행거리·차량 수·운임을 입력하면 총 운송비와 절감 효과를 바로 확인할 수 있습니다.</p>
          </div>
          <span className="badge">AI LEX 3기</span>
        </div>
      </header>

      <main className="container">
        <section className="kpis" aria-label="핵심 지표">
          <div className="kpi">
            <span className="kpi-label">총 운송비</span>
            <strong className="kpi-value">{formatWon(result.totalCost)}</strong>
            <span className="kpi-sub">기준 {formatWon(result.baseCost)}</span>
          </div>
          <div className={`kpi ${tone}`}>
            <span className="kpi-label">{isSaving ? '절감액' : '추가 비용'}</span>
            <strong className="kpi-value">{formatWon(Math.abs(result.savings))}</strong>
            <span className="kpi-sub">기준 운송비 대비</span>
          </div>
          <div className={`kpi ${tone}`}>
            <span className="kpi-label">{isSaving ? '절감률' : '증가율'}</span>
            <strong className="kpi-value">{formatNumber(Math.abs(result.savingsRate), 1)}%</strong>
            <span className="kpi-sub">(기준 − 적용) ÷ 기준</span>
          </div>
          <div className="kpi">
            <span className="kpi-label">총 운행거리</span>
            <strong className="kpi-value">{formatNumber(result.totalDistanceKm, 1)} km</strong>
            <span className="kpi-sub">차량당 {formatWon(result.costPerVehicle)}</span>
          </div>
        </section>

        <div className="grid">
          <section className="card">
            <div className="card-head">
              <h2>운송 조건 입력</h2>
              <button type="button" className="btn-ghost" onClick={() => setValues(DEFAULTS)}>
                초기화
              </button>
            </div>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {FIELDS.map((f) => (
                <label key={f.key} className="field">
                  <span className="field-label">{f.label}</span>
                  <div className="input-wrap">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={f.step}
                      value={values[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      placeholder="0"
                    />
                    <span className="unit">{f.unit}</span>
                  </div>
                  <span className="field-hint">{f.hint}</span>
                </label>
              ))}
            </form>
          </section>

          <section className="card">
            <h2>계산 결과</h2>
            <dl className="breakdown">
              <div>
                <dt>총 운행거리</dt>
                <dd>
                  {formatNumber(num('distanceKm'), 1)} km × {formatNumber(num('vehicles'))}대 ={' '}
                  <b>{formatNumber(result.totalDistanceKm, 1)} km</b>
                </dd>
              </div>
              <div>
                <dt>총 운송비 (적용)</dt>
                <dd>
                  {formatNumber(result.totalDistanceKm, 1)} km × {formatWon(num('ratePerKm'))} ={' '}
                  <b>{formatWon(result.totalCost)}</b>
                </dd>
              </div>
              <div>
                <dt>기준 운송비</dt>
                <dd>
                  {formatNumber(result.totalDistanceKm, 1)} km × {formatWon(num('baseRatePerKm'))} ={' '}
                  <b>{formatWon(result.baseCost)}</b>
                </dd>
              </div>
            </dl>

            <div className="bars" aria-label="운송비 비교">
              <div className="bar-row">
                <span>기준</span>
                <div className="bar-track">
                  <div className="bar base" style={{ width: `${(result.baseCost / barMax) * 100}%` }} />
                </div>
                <span className="bar-val">{formatWon(result.baseCost)}</span>
              </div>
              <div className="bar-row">
                <span>적용</span>
                <div className="bar-track">
                  <div className="bar now" style={{ width: `${(result.totalCost / barMax) * 100}%` }} />
                </div>
                <span className="bar-val">{formatWon(result.totalCost)}</span>
              </div>
            </div>

            <p className={`summary ${tone}`}>
              {result.baseCost === 0
                ? '값을 입력하면 절감 효과가 표시됩니다.'
                : isSaving
                  ? `기준 대비 ${formatWon(result.savings)} (${formatNumber(result.savingsRate, 1)}%) 절감됩니다.`
                  : `기준 대비 ${formatWon(-result.savings)} (${formatNumber(-result.savingsRate, 1)}%) 더 듭니다.`}
            </p>
          </section>
        </div>
      </main>

      <footer className="footer">모든 계산은 브라우저에서 처리되며 입력값은 저장·전송되지 않습니다.</footer>
    </div>
  );
}
