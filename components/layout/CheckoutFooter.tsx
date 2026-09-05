export function CheckoutFooter() {
  return (
    <footer className="border-t border-lm bg-cream">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center justify-between gap-2 px-5 py-6 md:flex-row md:px-8 lg:px-12">
        <p className="font-sans text-[0.7rem] text-mauve">
          © {new Date().getFullYear()} Velura
        </p>
        <p className="font-sans text-[0.7rem] text-mauve">
          UPI · Cards · Net Banking · COD
        </p>
      </div>
    </footer>
  )
}
