# Sample skincare catalog

`products.csv` contains six fictional morrow skincare and beauty products with eight variants. Products belong in Shopify, not in theme source code.

The six product rows use `Status=active` and `Published=TRUE` so imports can appear on the Online Store. Continuation rows contain variant data and leave product-level fields blank. **Importing this file makes sample products available for sale.** Names, descriptions, prices, SKUs, and inventory are demonstration data. Review your store's currency, pricing, tax settings, stock, and product details before selling.

## First import

1. Back up an existing catalog with a product CSV export.
2. Open **Shopify Admin → Products → Import**, then upload `import/products.csv`.
3. Leave **Overwrite products with matching handles** unchecked for a first import. Review the preview and field mappings before confirming.
4. Check the imported products are **Active** and available to **Online Store**. If Shopify gives you a publishing checkbox during import, enable it for Online Store visibility.
5. Add products to the desired collection and choose it in the theme editor. Draft or unpublished products will not appear in public collections.
6. Replace sample descriptions with accurate sizes, ingredients, instructions, and warnings. Confirm photos represent the actual products before selling.
7. For multiple inventory locations, verify quantities in Admin; use Shopify's inventory CSV workflow for location-specific stock.

## Update products already imported

Use `import/products-update.csv` for the existing sample catalog. It adds image references and changes the six products to active/published. This file deliberately omits price, SKU, and inventory columns so these values are not supplied by the update.

1. Export a backup first, then upload the update through **Products → Import**.
2. Enable **Overwrite products with matching handles**. Without it, Shopify skips products whose handles already exist.
3. Confirm all six handles and all eight variants in the preview. The update assumes the original sample handles and option values have not been renamed; if they have, export your current products and merge changes into that export instead.
4. Confirm prices, inventory, variant options, photos, and Online Store availability after import.

Image URLs reference public Pexels stock photographs for demonstration. They are styling placeholders, not photographs of actual morrow formulations or packaging. Different products share some stock photographs, and supporting images include texture and portrait shots. Replace them with your own accurate product photography before selling. Shopify downloads remote images during import; check the import result for any image-fetch failures.

Repeated imports can duplicate gallery media. Remove unwanted duplicates in Shopify Admin. Assign the intended image to each variant, and verify multiple gallery images are present to exercise the product slider.

## Format reference

See [Shopify's product CSV documentation](https://help.shopify.com/en/manual/products/import-export/using-csv). The files use UTF-8 and Shopify's backward-compatible product column names. Each CSV has 18 rows: three image positions per product, with eight rows also carrying variant options. Daily Dew Serum has 30 ml and 50 ml sizes; Cloud Cream Moisturizer has 50 ml and 100 ml sizes. Four other products each have one default variant. Keep rows for a product grouped together. Product-level fields belong on the first row, with blank continuation rows for further variants or images.

These files do not create collections, shipping rates, or store policies. Product data is separate from the theme. Shopify Admin is the source of truth after import.
