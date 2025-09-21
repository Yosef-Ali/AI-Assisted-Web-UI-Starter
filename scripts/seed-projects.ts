import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Idempotent: check if client exists
    const { data: clients } = await supabase.from('clients').select('*').eq('name', 'Acme Corp');
    let clientId: string;
    if (clients && clients.length > 0) {
        clientId = clients[0].id;
        console.log('Client already exists:', clientId);
    } else {
        const { data, error } = await supabase.from('clients').insert({ name: 'Acme Corp', notes: 'Seeded client' }).select('*').single();
        if (error) throw error;
        clientId = data.id;
        console.log('Created client:', clientId);
    }

    // Idempotent: check if project exists
    const { data: projects } = await supabase.from('projects').select('*').eq('code', 'ACME-PM');
    let projectId: string;
    if (projects && projects.length > 0) {
        projectId = projects[0].id;
        console.log('Project already exists:', projectId);
    } else {
        const { data, error } = await supabase.from('projects').insert({
            client_id: clientId,
            name: 'Acme Project',
            code: 'ACME-PM',
            description: 'Seeded project',
        }).select('*').single();
        if (error) throw error;
        projectId = data.id;
        console.log('Created project:', projectId);
    }

    // Idempotent: check if invoice exists
    const { data: invoices } = await supabase.from('invoices').select('*').eq('code', 'INV-001');
    if (invoices && invoices.length > 0) {
        console.log('Invoice already exists:', invoices[0].id);
    } else {
        const { error } = await supabase.from('invoices').insert({
            project_id: projectId,
            code: 'INV-001',
            amount_cents: 10000,
            currency: 'USD',
            title: 'Seed Invoice',
        });
        if (error) throw error;
        console.log('Created invoice for project:', projectId);
    }

    console.log('Seed complete.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
