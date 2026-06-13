/** Shop avatar frames / title badges validity after purchase or renewal. */
export const SHOP_ITEM_VALIDITY_DAYS = 180;

export function addShopValidity(from: Date = new Date()): Date {
  return new Date(
    from.getTime() + SHOP_ITEM_VALIDITY_DAYS * 24 * 60 * 60 * 1000
  );
}

export function formatShopValidityNote(): string {
  return `兑换后有效期 ${SHOP_ITEM_VALIDITY_DAYS} 天（约 6 个月），可重复兑换续期`;
}
