drop policy "Operators update own unlocked transactions" on public.transactions;

create policy "Operators update own or demo transactions"
on public.transactions
for update
to authenticated
using (operator_id = auth.uid() or is_demo = true)
with check (operator_id = auth.uid() or is_demo = true);