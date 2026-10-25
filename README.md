# morrow | Shopify skincare storefront

A custom Shopify Online Store 2.0 theme for a fictional skincare and beauty brand. Built with Liquid, Tailwind CSS v4, vanilla JavaScript, and native Shopify shopping forms. No product data is hardcoded in the theme.

## Local development

Install dependencies with `npm ci`. Install/authenticate Shopify CLI separately, then run `npm run dev` to start the CSS watcher and store preview. Use `npm run build` for minified CSS, `npm run shopify:check` for Liquid validation, `node tests/theme.test.cjs` for motion behavior checks, and `node tests/product.test.cjs` for variant and gallery checks.

## Store setup

Import the separate [sample catalog](import/products.csv) using [these instructions](import/README.md). The sample CSV now marks all six products active and available to Online Store. If you imported the earlier draft-only CSV, use `import/products-update.csv` to add demo images and enable visibility; follow the import README before overwriting matching handles. Review the sample copy, prices, stock images, and store publication settings before using this fictional catalog beyond a portfolio demo. Select a featured collection in the homepage section settings; otherwise it uses the store catalog. Until products are available, the theme shows an empty state.

Customize the hero image and copy, brand name, announcement, and newsletter in the theme editor. Product, collection, search, content, cart, password, and 404 pages are included. Variant radio choices update prices, availability, quantity rules, and the image slider automatically. Without JavaScript, a native form applies the variant choice. Add-to-cart and checkout use Shopify's native forms.

## Design and motion

Blush and berry colors, oversized sans-serif typography, arched beauty imagery, responsive product grids, and system dark mode. Staged text and section entrances use IntersectionObserver, with reduced-motion and no-JavaScript fallbacks. Shopify editor section loads are supported.

## Photography

The editable default hero is stock beauty photography from [Unsplash](https://images.unsplash.com/photo-1616394584738-fc6e612e71b9), downloaded from `https://images.unsplash.com/photo-1616394584738-fc6e612e71b9`. It is editorial imagery, not a photograph of the fictional catalog. Replace it with your own campaign before presenting a real commercial brand.

## Validation limits

Theme Check and motion self-checks validate source code; real store checkout, inventory, payment, and newsletter delivery require a connected Shopify store. Do not commit credentials or local `.shopify/` state.

## Page coverage

Includes homepage, product, collection, collection directory, search, cart, general content, contact, blog, article/comments, gift card, password, and 404 templates. Create a contact page in Shopify Admin and assign the `contact` template. Create blog posts, collections, menus, shipping/refund policies, and content pages in Shopify Admin; the theme reads their actual content.

Seven customer templates cover legacy login, registration, account, addresses, order detail, activation, and password reset. New customer accounts and checkout are hosted by Shopify and styled/configured through Shopify Admin. Set Header → Customer account URL to your Shopify-hosted account URL. This store is configured to use `https://shopify.com/83610501346/account`. When the setting is blank, the header uses Shopify's sign-in route for guests and the account route for signed-in customers. Add contact/blog/collections links through the footer menu setting.
