import dayjs from 'dayjs';

export async function GET() {
	return new Response(
		`
        <?xml version="1.0" encoding="UTF-8" ?>
            <urlset			
                xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="https://www.w3.org/1999/xhtml"
                xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
                xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
                xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
                xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
                <url>
                    <loc>https://powderhound.io/</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>1.0</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts</loc>
                    <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
                    <changefreq>hourly</changefreq>
                    <priority>0.8</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry</loc>
                    <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
                    <changefreq>hourly</changefreq>
                    <priority>0.7</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/login</loc>
                    <lastmod>2023-02-09</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>0.6</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/signup</loc>
                    <lastmod>2023-02-09</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>0.5</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/wolf-creek-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                    <url>
                    <loc>https://powderhound.io/conditions/resorts/beaver-creek</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/crested-butte</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/berthoud-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/bear-lake</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/cottonwood-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/steamboat</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/sunlight-mountain</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/powderhorn</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/aspen-snowmass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/cameron-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/vail</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/aspen-mountain</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                    <url>
                    <loc>https://powderhound.io/conditions/resorts/keystone</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/eldora</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/red-mountain-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/aspen-highlands</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/a-basin</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/copper-mountain</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/loveland-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/monarch</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/winter-park</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/telluride</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/silverton-mountain</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/purgatory</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/resorts/loveland</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/vail-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/fremont-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/conditions/backcountry/farwell-mountain</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                    <url>
                    <loc>https://powderhound.io/conditions/resorts/breckenridge</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                    <url>
                    <loc>https://powderhound.io/conditions/backcountry/lizard-head-pass</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.4</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/terms-of-use</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.1</priority>
                </url>
                <url>
                    <loc>https://powderhound.io/privacy-policy</loc>
                    <lastmod>2024-02-12</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.1</priority>
                </url>
            </urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}