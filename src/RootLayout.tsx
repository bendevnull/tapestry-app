import BootstrapClient from "./BootstrapClient";

export default function RootLayout({ children }: any) {
    return (
        <html lang="en">
            <head>
                <title>Tapestry</title>
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                />
            </head>
            <body>
                <BootstrapClient />
                {children}
            </body>
        </html>
    );
}