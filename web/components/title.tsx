export function Title({ children }: { children: React.ReactNode }) {
    return <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">{children}</h1>
}

export function SubTitle({ children }: { children: React.ReactNode }) {
    return <p className="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">{children}</p>
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-12 [&+.steps]:mt-0! [&+.steps>h3]:mt-4! [&+h3]:mt-6! [&+p]:mt-4!">
            {children}
        </h2>
    )
}
