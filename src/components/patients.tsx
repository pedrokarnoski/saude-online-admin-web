import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPen,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export type Patient = {
  id: string
  name: string
  age: number
  document: string
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <div className="w-56">
        <Label>{row.getValue('name')}</Label>
      </div>
    ),
  },
  {
    accessorKey: 'age',
    header: 'Idade',
    cell: ({ row }) => <Label>{row.getValue('age')}</Label>,
  },
  {
    accessorKey: 'document',
    header: 'Documento',
    cell: ({ row }) => <Label>{row.getValue('document')}</Label>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <div className="w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem className="gap-3" onClick={() => null}>
                <Ban />
                Excluir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3">
                <UserPen />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function Patient({ data }: { data: Patient[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <UsersRound className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal md:px-8 lg:px-12"
              >
                <UserPlus className="mr-2 size-4 text-primary" />
                Cadastrar novo
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2"></PopoverContent>
        </Popover>
      </div>
      <p className="text-sm text-muted-foreground">
        Consulte os dados de seus pacientes
      </p>

      <div>
        <div className="w-full">
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Pesquise aqui..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="mr-4 max-w-lg"
            />
            <div className="inline-flex gap-2 text-sm font-medium text-muted-foreground sm:text-base">
              Registros
              <span className="items-center rounded-sm bg-primary px-3 text-white">
                {table.getFilteredRowModel().rows.length}
              </span>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <Label className="text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
