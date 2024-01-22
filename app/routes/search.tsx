import { BotCard, BotCardSkeleton } from '@/entities/bot-card'
import { Bot } from '@/shared/model/bot'
import { searchBots } from '@/server/bots'
import { Input } from '@/shared/shadcn/ui/input'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/ui/select'
import { Select } from '@radix-ui/react-select'
import { LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node'
import { Form, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const handle = { i18n: 'search' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Search — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
  ]
}

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const sort = url.searchParams.get('sort')
  const bots = await searchBots({
    query: q,
    sort: sort
  })
  return json({ bots, q, sort })
}

export default function SearchPage() {
  const { q, sort, bots } = useLoaderData<typeof loader>()
  const { t } = useTranslation('search')
  const [sortValue, setSortValue] = React.useState<'popular' | 'newest' | 'oldest'>('popular')
  const submit = useSubmit()
  const navigation = useNavigation()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    const searchField = document.getElementById('q')
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || ''
    }
  }, [q])

  React.useEffect(() => {
    setSortValue((sort as 'popular' | 'newest' | 'oldest') || 'popular')
  }, [sort])

  return (
    <div className='w-full flex flex-col gap-6'>
      <div
        className='w-full flex items-center justify-center py-8'
      >
        <Form 
          id="search-form" 
          role="search"
          className='flex flex-col gap-4'
          onChange={(event) => {
            const isFirstSearch = q === null
            submit(event.currentTarget, {
              replace: !isFirstSearch
            })
          }}
          ref={formRef}
        >
          <Input 
            aria-label={t('placeholder')}
            defaultValue={q || ''} 
            id="q"
            name="q"
            placeholder={t('placeholder')}
            type="search"  
            className='text-3xl w-[1050px] h-auto p-8 rounded-2xl'
          />
          <div className='flex gap-2 items-center ml-auto'>
            <span>{t('sort.title')}:</span>
            <Select
              name='sort'
              value={sortValue || 'popular'}
              onValueChange={sortValue => {
                setSortValue(sortValue as 'popular' | 'newest' | 'oldest')
                submit(formRef.current)
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('sort.title')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'popular'}>{t('sort.popular')}</SelectItem>
                  <SelectItem value={'newest'}>{t('sort.newest')}</SelectItem>
                  <SelectItem value={'oldest'}>{t('sort.oldest')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Form>
      </div>
      <div style={{ minHeight: 'calc(100vh - 400px)' }}>
        <Results 
          loading={navigation.state === 'loading'}
          bots={bots} 
        />
      </div>
    </div>
  )
}

function Results({ loading, bots }: {
  loading: boolean
  bots: Bot[]
})  {
  const { t } = useTranslation('search')

  if (!loading && !bots.length) {
    return (
      <div className='w-full flex items-center justify-center py-8'>
        <div className='w-full flex items-center justify-center py-8'>
          <h1 className='text-3xl'>{t('not_found')}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full grid grid-cols-4 p-12 gap-4'>
      {loading ? (
        <>
          <BotCardSkeleton />
          <BotCardSkeleton />
          <BotCardSkeleton />
          <BotCardSkeleton />
        </>
      ) : (
        bots.map(bot => (
          <BotCard bot={bot} key={bot.id} />
        ))
      )}
    </div>
  )
}