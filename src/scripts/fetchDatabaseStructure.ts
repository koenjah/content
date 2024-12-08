import { supabase } from '../integrations/supabase/client';

// Supabase connection details from your client.ts
// const supabaseUrl = "https://toshxkanuhofshjqamlx.supabase.co";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ2MjU2MjUsImV4cCI6MjA4OTk4NTYyNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0";

// const supabase = createClient(supabaseUrl, supabaseKey);

interface TableStructure {
  name: string;
  columns: {
    name: string;
    type: string;
    is_nullable: string;
    default_value: string | null;
  }[];
  relationships: {
    constraint_name: string;
    column_name: string;
    foreign_table: string;
    foreign_column: string;
  }[];
}

/**
 * Safely fetches database structure using read-only operations
 */
async function fetchDatabaseStructure() {
  try {
    // Get all tables in our schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      throw tablesError;
    }

    const structure: Record<string, TableStructure> = {};

    // Process each table
    for (const tableName of tables || []) {
      // Get column information
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_columns', { table_name: tableName });

      if (columnsError) {
        console.error(`Error fetching columns for ${tableName}:`, columnsError);
        throw columnsError;
      }

      // Get foreign key relationships
      const { data: foreignKeys, error: fkError } = await supabase
        .rpc('get_foreign_keys', { table_name: tableName });

      if (fkError) {
        console.error(`Error fetching foreign keys for ${tableName}:`, fkError);
        throw fkError;
      }

      // Compile table structure
      structure[tableName] = {
        name: tableName,
        columns: columns?.map(col => ({
          name: col.column_name,
          type: col.data_type + (col.character_maximum_length ? `(${col.character_maximum_length})` : ''),
          is_nullable: col.is_nullable,
          default_value: col.column_default
        })) || [],
        relationships: foreignKeys?.map(fk => ({
          constraint_name: fk.constraint_name,
          column_name: fk.column_name,
          foreign_table: fk.foreign_table_name,
          foreign_column: fk.foreign_column_name
        })) || []
      };
    }

    // Output the structure
    console.log('Database Structure:');
    console.log(JSON.stringify(structure, null, 2));

    return structure;
  } catch (error) {
    console.error('Error fetching database structure:', error);
    throw error;
  }
}

// Execute the function
fetchDatabaseStructure()
  .then(() => console.log('Done fetching database structure'))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

export { fetchDatabaseStructure, type TableStructure };
