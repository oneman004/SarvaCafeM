import menuItems from "../data/menuData";

export function buildOrderPayload(cart, tableNumber = "1") {
  const items = Object.entries(cart).map(([name, quantity]) => {
    const item = menuItems.find(i => i.name === name);
    return { name, quantity, price: item?.price || 0 };
  });
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const gst = +(subtotal * 0.05).toFixed(2);
  const totalAmount = +(subtotal + gst).toFixed(2);
  return { tableNumber, items, subtotal, gst, totalAmount };
}
