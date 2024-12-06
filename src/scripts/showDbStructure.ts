import { supabase } from "../integrations/supabase/client";

async function showDatabaseStructure() {
    try {
        // Get all tables
        const { data: tables, error: tablesError } = await supabase
            .from('article_jobs')
            .select('*')
            .limit(1);

        if (tablesError) {
            console.error('Error fetching tables:', tablesError);
            return;
        }

        console.log('Database structure:');
        console.log('Table: article_jobs');
        if (tables && tables.length > 0) {
            console.log('Columns:', Object.keys(tables[0]));
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

showDatabaseStructure();
