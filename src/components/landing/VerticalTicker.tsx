import { BowlFoodIcon, CowIcon, FishSimpleIcon, ForkKnifeIcon, SnowflakeIcon } from "@phosphor-icons/react";

type VerticalTickerProps = {
  items: string[];
};

const tickerIcons = {
  "Live for Global Seafood": FishSimpleIcon,
  "Testing for Meat": ForkKnifeIcon,
  "Testing for Dairy": CowIcon,
  "Testing for Frozen Veggies": SnowflakeIcon
};

export function VerticalTicker({ items }: VerticalTickerProps) {
  return (
    <div className="hero-ticker" aria-label={items.join(", ")}>
      <div className="hero-ticker-window" aria-hidden="true">
        <div className="hero-ticker-track">
          {[...items, items[0]].map((item, index) => {
            const Icon = tickerIcons[item as keyof typeof tickerIcons] ?? BowlFoodIcon;
            return (
            <span key={`${item}-${index}`} className="hero-ticker-item">
              <Icon weight="duotone" aria-hidden />
              {item}
            </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
