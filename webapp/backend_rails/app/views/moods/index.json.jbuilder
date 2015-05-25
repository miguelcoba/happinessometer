json.array!(@moods) do |mood|
  json.extract! mood, :id, :level, :comment, :created_at
  # json.url mood_url(mood, format: :json)
end
