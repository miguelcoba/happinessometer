json.array!(@moods) do |mood|
  json.extract! mood, :id, :level, :comment
  json.url mood_url(mood, format: :json)
end
