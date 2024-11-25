import { useQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'
import {
  ArrowUpDown,
  Ban,
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MessageCircleWarning,
  MoreHorizontal,
  SunMedium,
  Sunrise,
} from 'lucide-react'
import { useState } from 'react'

import type { Schedule } from '@/api/get-schedule'
import { getSchedule } from '@/api/get-schedule'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const timezone = 'America/Sao_Paulo'

export const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: 'patientName',
    header: 'Nome do paciente',
    cell: ({ row }) => <Label>{row.getValue('patientName')}</Label>,
  },
  {
    accessorKey: 'specialtyName',
    header: 'Doutor(a)',
    cell: ({ row }) => <Label>{row.getValue('specialtyName')}</Label>,
  },
  {
    accessorKey: 'dateHour',
    header: 'Data',
    cell: ({ row }) => {
      const date = format(
        toZonedTime(new Date(row.getValue('dateHour')), timezone),
        'dd/MM/yyyy',
        {
          locale: ptBR,
        },
      )

      return (
        <div>
          <Label>{date}</Label>
        </div>
      )
    },
  },
  {
    accessorKey: 'dateHour',
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Horário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const time = format(new Date(row.getValue('dateHour')), 'HH:mm', {
        locale: ptBR,
      })

      const hour = new Date(row.getValue('dateHour')).getHours()

      return (
        <div className="flex flex-row items-center gap-3">
          {hour < 12 ? (
            <Sunrise className="h-5 w-5 text-yellow-200" />
          ) : (
            <SunMedium className="h-5 w-5 text-yellow-500" />
          )}
          <Label>{time}</Label>
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <div className="w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem className="gap-3" onClick={() => null}>
                <Ban />
                Cancelar agendamento
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3">
                <MessageCircleWarning />
                Enviar lembrete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function Schedule() {
  const { data: schedule = [], isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['schedules'],
    queryFn: getSchedule,
    staleTime: Infinity,
  })

  const [dateHour, setDateHour] = useState<Date>(new Date())
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'dateHour', value: format(new Date(), 'yyyy-MM-dd') },
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: schedule as Schedule[],
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

  const handleDateHourSelect = (selectedDateHour: Date | undefined) => {
    if (selectedDateHour) {
      setDateHour(selectedDateHour)
    }

    if (selectedDateHour) {
      const formattedDate = format(selectedDateHour, 'yyyy-MM-dd')

      table.getColumn('dateHour')?.setFilterValue(formattedDate)
    } else {
      table.getColumn('dateHour')?.setFilterValue(undefined)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {dateHour ? (
                  format(dateHour, 'PPP', { locale: ptBR })
                ) : (
                  <span className="text-muted-foreground">
                    Selecione a data
                  </span>
                )}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <Calendar
              mode="single"
              selected={dateHour}
              onSelect={handleDateHourSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-sm text-muted-foreground">
        Consulte os seus horários agendados
      </p>

      <div>
        <div className="w-full">
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Pesquise aqui..."
              value={
                (table.getColumn('patientName')?.getFilterValue() as string) ??
                ''
              }
              onChange={(event) =>
                table
                  .getColumn('patientName')
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="inline-flex gap-2 text-sm font-medium text-muted-foreground sm:text-base">
              Horários agendados{' '}
              {isLoadingSchedule ? (
                <Skeleton className="h-6 w-8" />
              ) : (
                <span className="items-center rounded-sm bg-primary px-3 text-white">
                  {table.getFilteredRowModel().rows.length}
                </span>
              )}
            </div>
          </div>

          {isLoadingSchedule ? (
            <Skeleton className="h-64 w-full" />
          ) : (
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
                        Nenhum agendamento para esta data ✌️😁
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between py-4">
            {isLoadingSchedule ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <Label className="text-muted-foreground">
                Página {table.getState().pagination.pageIndex + 1} de{' '}
                {table.getPageCount() > 0 ? table.getPageCount() : 1}
              </Label>
            )}

            <div className="flex items-center space-x-3">
              {isLoadingSchedule ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
