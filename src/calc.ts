export interface CostInput {
  /** 운행거리 (km, 차량 1대 기준) */
  distanceKm: number;
  /** 투입 차량 수 (대) */
  vehicles: number;
  /** 적용 km당 운임 (원) */
  ratePerKm: number;
  /** 비교 기준 km당 운임 (원) — 기존 계약 운임 등 */
  baseRatePerKm: number;
}

export interface CostResult {
  totalDistanceKm: number;
  totalCost: number;
  baseCost: number;
  costPerVehicle: number;
  savings: number;
  savingsRate: number;
}

const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculate(input: CostInput): CostResult {
  const distance = safe(input.distanceKm);
  const vehicles = Math.floor(safe(input.vehicles));
  const rate = safe(input.ratePerKm);
  const baseRate = safe(input.baseRatePerKm);

  const totalDistanceKm = distance * vehicles;
  const totalCost = Math.round(totalDistanceKm * rate);
  const baseCost = Math.round(totalDistanceKm * baseRate);
  const savings = baseCost - totalCost;
  const savingsRate = baseCost > 0 ? (savings / baseCost) * 100 : 0;

  return {
    totalDistanceKm,
    totalCost,
    baseCost,
    costPerVehicle: vehicles > 0 ? Math.round(totalCost / vehicles) : 0,
    savings,
    savingsRate,
  };
}

export const formatWon = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;
export const formatNumber = (n: number, digits = 0) =>
  n.toLocaleString('ko-KR', { maximumFractionDigits: digits });
