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
import { getAccount } from '@/server/auth'

export const handle = { i18n: 'search' }

export const meta: MetaFunction = () => {
  return [
    { title: 'Search — Session Bots Directory' },
    { name: 'description', content: 'Session bots directory website is a place to discover new bots created by Session developers community' },
    { property: 'og:titoe', content: 'Search' }
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

  const botsTransformed = await Promise.all(
    bots.map(async bot => {
      const account = await getAccount(bot.author)
      return {
        ...bot,
        author: account?.displayName ?? bot.author
      }
    })
  )

  return json({ bots: botsTransformed, q, sort })
}

export default function SearchPage() {
  const { q, sort, bots } = useLoaderData<typeof loader>()
  const { t } = useTranslation('search')
  const [sortValue, setSortValue] = React.useState<'popular' | 'newest' | 'oldest'>('popular')
  const submit = useSubmit()
  const navigation = useNavigation()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [isFirstSearch, setIsFirstSearch] = React.useState(true)

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
        className='w-full flex items-center justify-center 1060:py-8'
      >
        <Form 
          id="search-form" 
          role="search"
          className='flex flex-col gap-2 1060:gap-4 max-w-full'
          onChange={(event) => {
            setIsFirstSearch(false)
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
            className='text-base md:text-xl 1060:text-3xl w-[1050px] max-w-full h-auto p-4 md:p-6 1060:p-8 md:rounded-xl 1060:rounded-2xl'
          />
          <div className='flex gap-2 items-center ml-auto text-xs md:text-sm 1060:text-base'>
            <span>{t('sort.title')}:</span>
            <Select
              name='sort'
              value={sortValue || 'popular'}
              onValueChange={sortValue => {
                setSortValue(sortValue as 'popular' | 'newest' | 'oldest')
                setTimeout(() => {
                  submit(formRef.current)
                }, 5)
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
    <div className='520:p-12 w-full flex justify-center'>
      <div className='grid grid-cols-1 md:grid-cols-2 1060:grid-cols-3 1400:grid-cols-4 gap-4'>
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
    </div>
  )
}