import { brandAssets } from "@/lib/brand";

export function SolarpunkCredit() {
  return (
    <a className="solarpunk-credit" href="https://solarpunk.technology" target="_blank" rel="noreferrer">
      <picture>
        <source srcSet={brandAssets.solarpunkDark} media="(prefers-color-scheme: dark)" />
        <img src={brandAssets.solarpunkLight} alt="" className="h-5 w-auto" />
      </picture>
      <span>
        made by <span className="font-semibold">Solarpunk</span> to solve Perishable Food
      </span>
    </a>
  );
}
