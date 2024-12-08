-- Function to get table indexes
CREATE OR REPLACE FUNCTION public.get_table_indexes(table_name text)
RETURNS TABLE (
    index_name text,
    column_names text[]
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.relname::text as index_name,
        array_agg(a.attname::text ORDER BY array_position(ix.indkey, a.attnum))::text[] as column_names
    FROM
        pg_class t,
        pg_class i,
        pg_index ix,
        pg_attribute a
    WHERE
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND t.relkind = 'r'
        AND t.relname = table_name
    GROUP BY
        i.relname;
END;
$$;
